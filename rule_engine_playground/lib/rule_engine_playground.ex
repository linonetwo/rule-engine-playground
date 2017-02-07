defmodule RuleEnginePlayground do
  require Logger
  @moduledoc """
  Documentation for RuleEnginePlayground.
  """

  @doc """
  Hello world.

  ## Examples

      iex> RuleEnginePlayground.hello
      :world

  """
  def hello do
    :worlds
    Logger.warn("useless function call")
  end

  @doc """
  <~>
  not in
  find whether a value is not inside a list
  """
  defp value <~> list do
    Enum.find_value(list, false, &(&1 != value))
  end

  defp format_compare(rule) do
    re_less_than_frag = ~r/(\S+) less than (\S+)/i
    re_larger_than_frag = ~r/(\S+) larger than (\S+)/i
    re_equal_to_frag = ~r/(\S+) equal to (\S+)/i

    rule
    |> (fn (rule) -> Regex.replace(re_less_than_frag, rule, "^\\g{1} < \\g{2}") end).()
    |> (fn (rule) -> Regex.replace(re_larger_than_frag, rule, "^\\g{1} > \\g{2}") end).()
    |> (fn (rule) -> Regex.replace(re_equal_to_frag, rule, "^\\g{1} = \\g{2}") end).()
  end

  @doc """
  exampel:
    format_is("aaa is bbb")
    "^aaa = bbb"
  """
  def format_is(rule) do
    re_is_literal_frag = ~r/(\S+) is "(\S+)"/i
    re_is_atom_frag = ~r/(\S+) is ([^"\s]+)/i

    rule
    |> (fn (rule) -> Regex.replace(re_is_literal_frag, rule, "^\\g{1} = \"\\g{2}\"") end).()
    |> (fn (rule) -> Regex.replace(re_is_atom_frag, rule, "^\\g{1} = :\\g{2}") end).()
  end

  def parse(rule) do
    Logger.warn("Parsing rule:  #{rule}")
    rule
    |> format_is
    |> format_compare
    |> Code.string_to_quoted
  end

  @doc """
    Try by
      funcs = RuleEnginePlayground.parse_db()
      Enum.at(funcs, 0).()
  """
  def parse_db() do
    rules = [
      %{id: 0, rule: "type is \"dht11\" and metric is temperature and value less than 50"},
      %{id: 1, rule: "type is \"dht12\" and metric is current and value larger than 50"},
    ]


    rules
    |> Enum.to_list
    |> Enum.map(fn %{:id => id, :rule => rule} ->
      case parse(rule) do
        {:ok, quoted_rule} ->
          fn -> Code.eval_quoted(quoted_rule)
          end
        {:error, {_, error, token}} -> Logger.warn("Quote Failed: {#{id}, #{rule}}")
      end
    end)
  end
end
